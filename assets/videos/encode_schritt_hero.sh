#!/bin/bash
# encode_schritt_hero.sh
# Uso: ./encode_schritt_hero.sh input.mp4
# Requisitos: ffmpeg con libx264 libx265 libvpx-vp9
set -euo pipefail

IN="$1"
if [ -z "$IN" ]; then
  echo "Uso: $0 inputfile"
  exit 1
fi

BASENAME="schritt-hero"
OUTDIR="outputs_${BASENAME}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTDIR"

declare -A SCALES=( ["1080"]="1920:1080" ["720"]="1280:720" ["480"]="854:480" )
declare -A BITRATE=( ["1080"]="4.5M" ["720"]="2.0M" ["480"]="700k" )

CRF_X264=24
CRF_VP9=28
CRF_X265=25

PRESET_X264="veryslow"
PRESET_VP9="good"
PRESET_X265="veryslow"

KEYINT=60
MOVFLAGS="+faststart"

encode_h264() {
  local res=$1 scale=${SCALES[$res]} br=${BITRATE[$res]}
  local out="$OUTDIR/${BASENAME}-${res}p-h264.mp4"
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libx264 -preset $PRESET_X264 -crf $CRF_X264 -b:v $br -x264-params keyint=$KEYINT:min-keyint=$KEYINT -an -pass 1 -f mp4 /dev/null
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libx264 -preset $PRESET_X264 -crf $CRF_X264 -b:v $br -x264-params keyint=$KEYINT:min-keyint=$KEYINT -an -pass 2 -movflags $MOVFLAGS "$out"
  echo "Created $out"
}

encode_vp9() {
  local res=$1 scale=${SCALES[$res]} br=${BITRATE[$res]}
  local out="$OUTDIR/${BASENAME}-${res}p-vp9.webm"
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libvpx-vp9 -b:v $br -crf $CRF_VP9 -preset $PRESET_VP9 -g $KEYINT -an "$out"
  echo "Created $out"
}

encode_hevc() {
  local res=$1 scale=${SCALES[$res]}
  local out="$OUTDIR/${BASENAME}-${res}p-hevc.mp4"
  ffmpeg -y -i "$IN" -vf "scale=${scale}" -c:v libx265 -preset $PRESET_X265 -crf $CRF_X265 -x265-params keyint=$KEYINT -an -movflags $MOVFLAGS "$out"
  echo "Created $out"
}

for res in 1080 720 480; do
  echo "Encoding ${res}p..."
  encode_h264 $res
  encode_vp9 $res
  encode_hevc $res
done

echo "Todos los archivos han sido creados en: $OUTDIR"
