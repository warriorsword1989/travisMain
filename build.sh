mkdir -p dist
mkdir -p build
# cd build
echo "################################开始并发打包################################"
. build2.sh & . build3.sh &
wait
echo "################################并发打包结束################################"
ls
cd ../..
ls
cp -r webEditor build
cp -r dist build
echo "extart files end"


echo "compress to zip start"
cd build
zip -rq ../WebApp.zip ./*
cd ..
echo "compress to zip end"

echo "remove build tmp file start"
rm -rf ./build
echo "remove build tmp file end"


