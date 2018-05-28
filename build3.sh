echo "#############################开始打包sdk############################################"
ls
cd build
git clone https://github.com/FastmapSDK/NavinfoDMI.git
cd NavinfoDMI
npm install
npm run-script dev
cp -r dist/* ../../dist