/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import crypto from "node:crypto";

const config = {
  name:"compresspdf",
  alias:["komprespdf","pdfcompress"],
  category:"tools",
  description:"Mengompres file PDF",
  usage:".compresspdf <reply/kirim PDF>",
  example:".compresspdf",
  cooldown:15,
  energi:1
};

const CHUNK_SIZE=1024*1024;
const UA="Mozilla/5.0";

async function fetchText(url,options={}){
  const res=await fetch(url,{
    ...options,
    headers:{
      "User-Agent":UA,
      Accept:"*/*",
      ...(options.headers||{})
    },
    signal:options.signal||AbortSignal.timeout(30000)
  });
  if(!res.ok)throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function getToken(){
  const html=await fetchText(
    "https://www.ilovepdf.com/compress_pdf"
  );

  const scriptMatch=html.match(
    /<script[^>]*>([\s\S]*?ilovepdfConfig\s*=[\s\S]*?)<\/script>/i
  );

  if(!scriptMatch){
    throw new Error("Config tidak ditemukan");
  }

  const script=scriptMatch[1];

  const jsonMatch=script.match(
    /(?:var\s+)?ilovepdfConfig\s*=\s*(\{[\s\S]*?\})\s*;/
  );

  if(!jsonMatch){
    throw new Error("JSON config tidak ditemukan");
  }

  let json;

  try{
    json=JSON.parse(jsonMatch[1]);
  }catch{
    throw new Error("Gagal parse config iLovePDF");
  }

  const csrfMatch=html.match(
    /<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i
  );

  const csrf=csrfMatch?.[1]||"";

  const taskMatch=script.match(
    /ilovepdfConfig\.taskId\s*=\s*['"]([^'"]+)['"]/
  );

  const taskId=
    taskMatch?.[1]||
    json?.taskId||
    "";

  if(!json?.token||!csrf){
    throw new Error("Token/CSRF gagal diambil");
  }

  if(!taskId){
    throw new Error("taskId tidak ditemukan");
  }

  return{
    token:json.token,
    csrf,
    taskId,
    servers:Array.isArray(json.servers)
      ? json.servers
      : []
  };
}

function createMultipart(fields,file){
  const boundary=
    "----ShinobuBoundary"+
    crypto.randomBytes(12).toString("hex");

  const chunks=[];

  for(const[name,value]of Object.entries(fields)){
    chunks.push(
      Buffer.from(
        `--${boundary}\r\n`+
        `Content-Disposition: form-data; name="${name}"\r\n\r\n`+
        `${value}\r\n`
      )
    );
  }

  chunks.push(
    Buffer.from(
      `--${boundary}\r\n`+
      `Content-Disposition: form-data; name="file"; filename="${file.filename}"\r\n`+
      `Content-Type: application/pdf\r\n\r\n`
    )
  );

  chunks.push(file.buffer);

  chunks.push(
    Buffer.from(`\r\n--${boundary}--\r\n`)
  );

  return{
    body:Buffer.concat(chunks),
    contentType:`multipart/form-data; boundary=${boundary}`
  };
}

async function uploadChunk(
  server,
  headers,
  task,
  buffer,
  filename,
  chunkIndex,
  totalChunks
){
  const form=createMultipart(
    {
      name:filename,
      chunk:String(chunkIndex),
      chunks:String(totalChunks),
      task
    },
    {
      filename,
      buffer
    }
  );

  const res=await fetch(
    `https://${server}.ilovepdf.com/v1/upload`,
    {
      method:"POST",
      headers:{
        ...headers,
        "Content-Type":form.contentType,
        "Content-Length":String(form.body.length)
      },
      body:form.body,
      signal:AbortSignal.timeout(60000)
    }
  );

  if(!res.ok){
    throw new Error(
      `Upload HTTP ${res.status}`
    );
  }

  return res.json();
}

async function uploadFileInChunks(
  server,
  headers,
  task,
  fullBuffer,
  filename
){
  const totalChunks=
    Math.ceil(
      fullBuffer.length/CHUNK_SIZE
    )||1;

  let lastResult=null;

  for(
    let i=0;
    i<totalChunks;
    i++
  ){
    const start=
      i*CHUNK_SIZE;

    const end=
      Math.min(
        start+CHUNK_SIZE,
        fullBuffer.length
      );

    const chunkBuffer=
      fullBuffer.subarray(
        start,
        end
      );

    lastResult=
      await uploadChunk(
        server,
        headers,
        task,
        chunkBuffer,
        filename,
        i,
        totalChunks
      );
  }

  return lastResult;
}

async function processCompress(
  server,
  headers,
  task,
  serverFilename,
  originalFilename
){
  const form=createMultipart(
    {
      compression_level:"recommended",
      isDefault:"",
      output_filename:"{filename}_compressed",
      packaged_filename:"ilovepdf_compressed",
      task,
      tool:"compress",
      "files[0][server_filename]":
        serverFilename,
      "files[0][filename]":
        originalFilename
    },
    {
      filename:"data.pdf",
      buffer:Buffer.alloc(0)
    }
  );

  const res=await fetch(
    `https://${server}.ilovepdf.com/v1/process`,
    {
      method:"POST",
      headers:{
        ...headers,
        "Content-Type":form.contentType,
        "Content-Length":String(form.body.length)
      },
      body:form.body,
      signal:AbortSignal.timeout(60000)
    }
  );

  if(!res.ok){
    throw new Error(
      `Process HTTP ${res.status}`
    );
  }

  return res.json();
}

async function downloadResult(
  server,
  headers,
  task
){
  const res=await fetch(
    `https://${server}.ilovepdf.com/v1/download/${task}`,
    {
      headers,
      signal:AbortSignal.timeout(120000)
    }
  );

  if(!res.ok){
    throw new Error(
      `Download HTTP ${res.status}`
    );
  }

  return Buffer.from(
    await res.arrayBuffer()
  );
}

async function compressPdf(
  buffer,
  filename
){
  const{
    token,
    csrf,
    taskId,
    servers
  }=await getToken();

  const server=
    servers[
      Math.floor(
        Math.random()*servers.length
      )
    ]||"api28";

  const headers={
    Authorization:"Bearer "+token,
    Origin:"https://www.ilovepdf.com",
    Cookie:"_csrf="+csrf,
    "User-Agent":UA
  };

  const upload=
    await uploadFileInChunks(
      server,
      headers,
      taskId,
      buffer,
      filename
    );

  if(!upload?.server_filename){
    throw new Error(
      "Upload PDF gagal"
    );
  }

  await processCompress(
    server,
    headers,
    taskId,
    upload.server_filename,
    filename
  );

  const resultBuffer=
    await downloadResult(
      server,
      headers,
      taskId
    );

  return{
    success:true,
    buffer:resultBuffer
  };
}

function getQuotedMessage(m){
  return(
    m?.quoted?.message||
    m?.quoted?.msg||
    m?.quoted||
    null
  );
}

function getMime(m){
  const q=getQuotedMessage(m);

  return(
    q?.documentMessage?.mimetype||
    q?.documentWithCaptionMessage?.message?.documentMessage?.mimetype||
    m?.message?.documentMessage?.mimetype||
    m?.msg?.mimetype||
    m?.mimetype||
    ""
  );
}

function isPdf(m){
  const mime=getMime(m);

  if(
    mime&&
    mime.toLowerCase()==="application/pdf"
  ){
    return true;
  }

  const q=getQuotedMessage(m);

  const filename=
    q?.documentMessage?.fileName||
    q?.documentWithCaptionMessage?.message?.documentMessage?.fileName||
    m?.message?.documentMessage?.fileName||
    "";

  return/\.pdf$/i.test(filename);
}

async function downloadMedia(m){
  const target=
    m?.quoted||
    m;

  if(
    typeof target?.download==="function"
  ){
    return target.download();
  }

  if(
    typeof m?.download==="function"
  ){
    return m.download();
  }

  throw new Error(
    "Method download media tidak tersedia"
  );
}

function getFilename(m){
  const q=getQuotedMessage(m);

  return(
    q?.documentMessage?.fileName||
    q?.documentWithCaptionMessage?.message?.documentMessage?.fileName||
    m?.message?.documentMessage?.fileName||
    `document_${Date.now()}.pdf`
  );
}

function randomFilename(){
  return(
    crypto.randomBytes(8).toString("hex")+
    ".pdf"
  );
}

async function handler(
  m,
  {sock}={}
){
  if(!isPdf(m)){
    return m.reply(
      `❌ *Kirim atau reply file PDF terlebih dahulu.*\n\n`+
      `Contoh:\n`+
      `.compresspdf`
    );
  }

  await m.react?.("⏳");

  try{
    const inputBuffer=
      await downloadMedia(m);

    if(
      !inputBuffer||
      !inputBuffer.length
    ){
      throw new Error(
        "PDF gagal didownload"
      );
    }

    const originalFilename=
      getFilename(m);

    await m.reply(
      `⏳ *Sedang mengompres PDF...*\n\n`+
      `> File: ${originalFilename}\n`+
      `> Ukuran awal: ${(inputBuffer.length/1024/1024).toFixed(2)} MB`
    );

    const result=
      await compressPdf(
        inputBuffer,
        originalFilename
      );

    if(
      !result?.success||
      !result?.buffer?.length
    ){
      throw new Error(
        "Hasil kompresi kosong"
      );
    }

    const filename=
      randomFilename();

    const sizeBefore=
      inputBuffer.length;

    const sizeAfter=
      result.buffer.length;

    const saved=
      sizeBefore>0
        ? Math.max(
            0,
            100-
            (sizeAfter/sizeBefore*100)
          )
        :0;

    await sock.sendMessage(
      m.chat,
      {
        document:result.buffer,
        mimetype:"application/pdf",
        fileName:filename,
        caption:
          `*✅ PDF BERHASIL DIKOMPRES*\n\n`+
          `> *File:* ${originalFilename}\n`+
          `> *Ukuran awal:* ${(sizeBefore/1024/1024).toFixed(2)} MB\n`+
          `> *Ukuran hasil:* ${(sizeAfter/1024/1024).toFixed(2)} MB\n`+
          `> *Pengurangan:* ${saved.toFixed(2)}%`
      },
      {
        quoted:m
      }
    );

    await m.react?.("✅");
  }catch(err){
    console.error(
      "[COMPRESSPDF]",
      err?.stack||err
    );

    await m.react?.("❌");

    return m.reply(
      `❌ *Gagal mengompres PDF.*\n\n`+
      `> ${err?.message||"Unknown error"}`
    );
  }
}

export default{
  config,
  handler
};