echo "#############################开始打包sdk############################################"
ls
cd build
git clone https://github.com/NavinfoWeb/Tollgate.git NavinfoDMI
cd NavinfoDMI
npm install
npm run build
ls dist/
cp -r dist/* ../../dist