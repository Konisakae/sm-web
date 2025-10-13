#!/bin/bash
# encode_multi.sh
# Uso: ./encode_multi.sh input.mp4
# Requisitos: ffmpeg con libx264 libx265 libvpx-vp9
set -euo pipefail

IN="$1"
if [ -z "$IN" ]; then
  echo "Uso: $0 inputfile"
  exit 1
fi

BASENAME="$(basename "${IN%.*}")"
OUTDIR="outputs_${BASENAME}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTDIR"

# Resolutions and scale filters
declare -A SCALES=( ["1080"]="1920:1080" ["720"]="1280:720" ["480"]="854:480" )

# Target bitrate (avg) for H.264 / VP9 guidance (adjustable)
declare -A BITRATE=( ["1080"]="4.5M" ["720"]="2.0M" ["480"]="700k" )

# CRF / quality knobs
CRF_X264=23      # H.264 constant quality (lower = better quality/larger)
CRF_VP9=28       # VP9 CRF (18-32 typical)
CRF_X265=25      # HEVC (x265) CRF (lower = better)

# Performance knobs
PRESET_X264="veryslow"     # slower => better compression
PRESET_VP9="good"      # good / best
PRESET_X265="veryslow"
CPU_USED_AV1=2         # not used here (we use x265 for Apple)

# Keyframe interval (approx; increase for slightly better compression)
KEYINT=60

# faststart for mp4 progressive playback
MOVFLAGS="+faststart"

# Encode functions (no audio: -an)
encode_h264() {
  local res=$1 scale=${SCALES[$res]} br=${BITRATE[$res]}
  local out="$OUTDIR/${BASENAME}_${res}p_h264.mp4"
  # Two-pass VBR for better size control with quality
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libx264 -preset $PRESET_X264 -crf $CRF_X264 -b:v $br -x264-params keyint=$KEYINT:min-keyint=$KEYINT -an -pass 1 -f mp4 /dev/null
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libx264 -preset $PRESET_X264 -crf $CRF_X264 -b:v $br -x264-params keyint=$KEYINT:min-keyint=$KEYINT -an -pass 2 -movflags $MOVFLAGS "$out"
  echo "Created $out"
}

encode_vp9() {
  local res=$1 scale=${SCALES[$res]} br=${BITRATE[$res]}
  local out="$OUTDIR/${BASENAME}_${res}p_vp9.webm"
  # VP9: use CRF + target bitrate (good quality/compression). Two-pass is slower; single pass CRF ok.
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libvpx-vp9 -b:v $br -crf $CRF_VP9 -preset $PRESET_VP9 -g $KEYINT -an "$out"
  echo "Created $out"
}

encode_hevc() {
  local res=$1 scale=${SCALES[$res]}
  local out="$OUTDIR/${BASENAME}_${res}p_hevc.mp4"
  # HEVC (x265) single-pass CRF — great compression for Apple devices (iOS/macOS supports HEVC)
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libx265 -preset $PRESET_X265 -crf $CRF_X265 -x265-params keyint=$KEYINT -an -movflags $MOVFLAGS "$out"
  echo "Created $out"
}

# Process each resolution sequentially to avoid overloading CPU
for res in 1080 720 480; do
  echo "Encoding ${res}p..."
  encode_h264 $res
  encode_vp9 $res
  encode_hevc $res
done

echo "Todos los archivos han sido creados en: $OUTDIR"
echo "Parámetros: H.264 CRF=$CRF_X264 preset=$PRESET_X264 ; VP9 CRF=$CRF_VP9 preset=$PRESET_VP9 ; HEVC CRF=$CRF_X265 preset=$PRESET_X265"
