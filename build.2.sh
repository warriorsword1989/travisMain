echo "#############################开始打包bussiness############################################"
git clone https://github.com/FastmapSDK/NavinfoFastmapBussiness.git
cd NavinfoFastmapBussiness
npm install
npm run-script dev
cp -r dist/* ../../dist