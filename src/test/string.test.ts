
let condition = "Unit='温度℃' and PointId='J6-1-1'";
let relation = condition.split(' and ');
for(let i=0;i<relation.length;i++){
    let rel = relation[i];
    let item = rel.split('=');
    let key = item[0];
    let value = item[1].split("'")[1];

    console.log(rel, key, value);
}
