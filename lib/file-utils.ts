import {Id} from "@/convex/_generated/dataModel";
interface FileUploadResult{
  fileIds:Id<"_storage">[];
  fileTypes:string[];
  fileNames:string[]
}
export async function uploadFiles(
  files:File[],
  generateUploadUrl:()=>Promise<string>,
  getUrl:(args:{storageId:Id<"_storage">})=>Promise<string>

):Promise<FileUploadResult>{
 const fileIds:Id<"_storage">[]=[];
 const fileTypes:string[]=[];
 const fileNames:string[]=[];
 const fileUrls:string[]=[];
 for(const file of files){
  try{
  const uploadUrl=await generateUploadUrl();
  const response=await fetch(uploadUrl,{
    method:"POST",
    headers:{
      "Content-Type":file.type
    },
    body:file
  });
  if(!response.ok){
    throw new Error("Failed to upload File");
  }
  const {storageId}=await response.json();
  fileIds.push(storageId);
  fileTypes.push(file.type);
  fileNames.push(file.name);
  const url=await getUrl({storageId : storageId as Id <"_storage">});
  if(url){
    fileUrls.push(url);
  }
 }
 catch(error){
  throw new Error("Failed to upload File");
 }
 return {
  fileIds,
  fileTypes,
  fileNames,
  fileUrls
 };
}
}