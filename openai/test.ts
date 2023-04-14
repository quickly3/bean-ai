import AiTools from './AiTools';
import * as dotenv from 'dotenv';

async function boostrap() {
  dotenv.config({ path: '../.env' });

  const aiTools = new AiTools();
  await aiTools.tpyeChat('小龙坎', 'food', 4);

  // await aiTools.tpyeChat('node 保存文件');

  // await aiTools.simpleCompl('我叫做Bean');
  // await aiTools.simpleCompl('你知道我的名字么？');

  // const modelList = await aiTools.listModels()
  // console.log(modelList.map(i=>i.id))
}

boostrap();
