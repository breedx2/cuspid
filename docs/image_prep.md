
Preparing images ahead of time:
```
for file in *.jpg ; do
   d=$(convert -format "%[fx:2^(round(log(max(w,h))/log(2)))]" $file info:) && \
   convert -crop 1:1 -gravity center -colorspace Gray -resize "${d}x${d}" $file ../$file
done
```
