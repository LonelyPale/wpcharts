npm i
npm run build
npm run server



http://192.168.1.149:9090/
http://localhost:8060/indexpage
Administrator
Administrator123

http://localhost:8060/logincheck?username=system&password=8ca9e6ba12fe2cc1bc171da063703676
http://localhost:8060/logincheck?username=Administrator&password=2a8277faa1cf6f3643d11055589e9073
http://localhost:8060/business/basic/datamanage/processLine?ids=AD0400BY3MX3022&starttime=2017-08-21&endtime=2019-08-21&dateNum=&physical=[{"COMP01":"频模(Hz²/1000)","COMP08":"温度(℃)","COMP09":"相对位移(mm)","COMP10":"绝对位移(mm)"}]



#旧版本 6+
npm install --save-dev babel-core
npm install --save-dev babel-cli
npm install --save-dev babel-preset-es2015
npm i -D babel-preset-latest babel-plugin-external-helpers

npm un babel-core
npm un babel-cli
npm un babel-preset-es2015
npm un babel-preset-latest babel-plugin-external-helpers


#新版本 7+
npm i -D @babel/core
npm i -D @babel/cli
npm i -D @babel/preset-es2015
npm i -D @babel/preset-env @babel/plugin-external-helpers
npm i -D @babel/node

npm i -g @babel/core @babel/cli @babel/preset-es2015
npm i -g @babel/node

npm install --save-dev rollup-plugin-json
npm install --save-dev rollup-plugin-babel
npm install --save-dev rollup-plugin-node-resolve

npm install --save-dev rollup
nim install --save-dev rollup-plugin-typescript

npm install -D typescript
npm install -g typescript

npm install -D live-server
npm install -g live-server
live-server --port=8080 --no-browser --mount=/wpcharts:.

npm install -D mockjs
npm install -g mockjs

npm install @types/d3
npm install d3

npm run build-babel
npm run build-rollup

npm i -g nrm
nrm ls

"build-babel": "babel src -d build --source-maps",
./node_modules/.bin/babel --no-babelrc src -d build --source-maps --presets=es2015

{
  "presets": ["@babel/preset-env"]
}
