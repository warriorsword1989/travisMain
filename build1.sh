echo "#############################开始打包sdk############################################"
ls
cd build
git clone https://github.com/FastmapSDK/NavinfoWebSDK.git
cd NavinfoWebSDK
npm install
npm run-script dev
cp -r dist/* ../../dist