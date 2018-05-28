mkdir -p dist
ls
echo "pull tollgate"
mkdir -p tollgate
cd tollage
ls
git clone https://github.com/NavinfoWeb/Tollgate.git
cd Tollgate
ls
npm install
npm run-script build
ls
cp -r ./dist ../../dist
echo "extart files start"
cd ../..
mkdir -p build
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


