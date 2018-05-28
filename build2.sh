echo "#############################开始打包bussiness############################################"
ls
cd build
git clone https://github.com/NavinfoWeb/Tollgate.git NavinfoFastmapBussiness
cd NavinfoFastmapBussiness
npm install
npm run build
cp -r dist/* ../../dist