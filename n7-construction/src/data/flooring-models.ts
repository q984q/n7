import type { Product } from './products-types';

type Model = [key:string, sourceVariant:number, name:string, sku?:string, thickness?:string];
// Only catalogued constructions and thicknesses become products. Colours remain options.
const models: Record<string, Model[]> = {
  'Y-6170': [['y6170',0,'Спортивный ПВХ Y-*6170','Y-6170','7,0 мм'],['y65170xs',1,'Баскетбольный ПВХ Y-65170XS','Y-65170XS','7,0 мм'],['yuhua',2,'Волейбольный рулон «Юйхуа»']],
  'PVC-2MM': [['heterogeneous',0,'Гетерогенный ПВХ',undefined,'2,0 мм'],['homogeneous',1,'Гомогенный ПВХ',undefined,'2,0 мм']],
  'PVC-CUSTOM': [2,3,4.5,6,8].map(n=>[String(n).replace('.','-'),n<4?0:1,'ПВХ с индивидуальным рисунком',undefined,`${String(n).replace('.',',')} мм`]),
  'WOOD-FIXED': [['double',0,'Паркет · двухъярусное основание'],['single',1,'Паркет · одноярусное основание'],['low',2,'Паркет · низкопрофильное основание'],['cross',3,'Паркет · основные и вспомогательные лаги'],['diagonal',4,'Паркет · фанера под углом 45°']],
  'SES-ELITE': [['elite',0,'Модуль SES Elite','SES-ELITE'],['battle-3',1,'Модуль SES Battle 3','SES Battle 3']],
  'E630': [['e630',0,'Модуль E630','E630'],['e620',1,'Модуль E620','E620'],['s800',2,'Модуль S800','S800']],
  'PEARL-ASTERISK': [['pearl',0,'Модуль Pearl Asterisk','PEARL-ASTERISK'],['flexible',1,'Гибкая модульная плитка']],
  'WET-3816': [3816,3817,3818,3819].map((n,i)=>[String(n),i,`Дренажный настил ${n}`,`WET-${n}`,'9 мм']),
  'TRACK-PREFAB': [['13mm',0,'Сборная беговая дорожка',undefined,'13 мм'],['9mm',1,'Сборная беговая дорожка',undefined,'9 мм']],
  'Y-2330P': [['y2330p',0,'Пиклбол · уличный рулон Y-2330P','Y-2330P','3,0 мм'],['y4330p',0,'Пиклбол · уличный рулон Y-4330P','Y-4330P','3,0 мм'],['acryl-2',1,'Пиклбол · акриловый рулон',undefined,'2,0 мм'],['acryl-3',1,'Пиклбол · акриловый рулон',undefined,'3,0 мм'],['indoor-21',2,'Пиклбол · зальный корт',undefined,'2,1 мм'],['indoor-31',2,'Пиклбол · зальный корт',undefined,'3,1 мм']],
};
export function expandFlooring(base:Product):Product[] {
  const entries=models[base.sku]; if(!entries) return [base];
  const slugs=entries.map(([key],i)=>i===0?base.slug:`${base.subcategory}-${key}`);
  return entries.map(([key,index,title,sku,thickness],i)=>{
    const variant=base.variants![index];
    const name=thickness?`${title} (${thickness})`:title;
    const spec=base.sku==='Y-2330P' && index===2 ? thickness! : variant.spec;
    return {...base,id:i===0?base.id:`${base.id}-${key}`,sku:sku||`${base.sku}-${key.toUpperCase()}`,slug:slugs[i], name,shortName:name,
      variants:[],badge:undefined,featured:base.featured && i===0, summary:spec,description:`${name}. ${variant.detail}. На фото показана серия покрытия.`,advantages:[variant.detail],certifications:[],warrantyYears:/гарантия 6 лет/i.test(spec)?6:0,
      specs:[...(thickness?[{label:'Толщина',value:thickness}]:[]),{label:'Конструкция',value:spec},{label:'Особенности',value:variant.detail}],
      relatedSlugs:[...slugs.filter(s=>s!==slugs[i]),...base.relatedSlugs], seoTitle:`${name} | N7 CONSTRUCTION`,seoDescription:`${name}. ${spec}. ${variant.detail}`};
  });
}
