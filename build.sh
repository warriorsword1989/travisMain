mkdir -p dist
echo "pull tollgate"
git clone https://github.com/NavinfoWeb/Tollgate.git
cd Tollgate
npm install
npm run-script build
cp -r dist ../dist
echo "extart files start"
mkdir -p build
cp -r webEditor build
cp -r dist build
echo "extart files end"


echo "compress to zip start"
cd build
zip -rq ../WebApp.zip ./*
cd ..
echo "compress to zip end"

# echo "remove build tmp file start"
# # rm -rf ${deploy_root}/build
# echo "remove build tmp file end"

