#!/bin/bash

# Note: If conversion fails with "cache resources exhausted" you may 
# need to increase memory and disk values in /etc/ImageMagick-6/policy.xml

WORK IN PROGRESS...

INDIR=$1

for file in ../newout_good/*.jpg ; do 
	d=$(convert -format "%[fx:min(8192,2^(round(log(min(w,h))/log(2))))]" $file info:); echo 
	$file $d; 
	convert -crop 1:1 -gravity center -colorspace Gray -resize "${d}x${d}" $file $(basename $file) ; 
done
