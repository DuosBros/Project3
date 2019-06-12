#!/bin/bash
rm -f *.aux *.log *.out *.toc 

for file in $(find `pwd` -iname *converted-to.pdf); 
  do 
   rm "$file"
done
