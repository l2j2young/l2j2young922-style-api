import {GoogleGenAI}from"@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export default async function handler(req,res){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");

    if(req.method==="OPTIONS"){
        return res.status(200).end();
    }
    
    
    const{name,age,gender,style}=req.body;
    if(!name||!age||!gender||!style){
       return res.status(400).json({error:"이름(name),나이(age),성별(gender),원하는 스타일(style)를 모두 입력해주세요."});
    }

    try{
        const today=new Date().toISOString().slice(0,10);
        const prompt=`
        이름:${name}
        나이:${age}
        성별:${gender}
        원하는 스타일:${style}
        
        최고의 코디를 추천해줘
        `;

        const result=await ai.models.generateContent({
            model:"gemini-2.0-flash",
            contents:prompt,
            config:{
                systeminstructions:
                "당신은 최고의 스타일리스트입니다. 패션센스와 색 조합에 탁월한 능력을 지니고 있어서 누구나 사진 없이 듣기만 해도 만족스러운 답안을 얻게 해줍니다. 상의 하의 신발 장신구 특별한 아이템 등 단계별로 나누어서 설명해주길 바라며 긍정적으로 답변해주세요.마지막 문구는 그 옷을 입고 행복한 시간을 보낼 사용자에게 좋은 말도 짧게 해주세요.",
            },
        });
        res.status(200).json({answer:result.text});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Gemini API 오류 발생"});
    
    }                          
}