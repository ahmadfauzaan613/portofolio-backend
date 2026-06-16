import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'                                                                                                           
    import path from 'path'                                                                                                                                                                        
                                                                                                                                                                                                   
    const s3 = new S3Client({                                                                                                                                                                      
      endpoint: process.env.MINIO_ENDPOINT || 'https://minio-api.oj3nglab.xyz',                                                                                                                    
      region: process.env.MINIO_REGION || 'us-east-1',                                                                                                                                             
      credentials: {                                                                                                                                                                               
        accessKeyId: process.env.MINIO_ACCESS_KEY || '',                                                                                                                                           
        secretAccessKey: process.env.MINIO_SECRET_KEY || '',                                                                                                                                       
      },                                                                                                                                                                                           
      forcePathStyle: true,                                                                                                                                                                        
    })                                                                                                                                                                                             
                                                                                                                                                                                                   
    const bucketName = process.env.MINIO_BUCKET || 'bucketwebsite'                                                                                                                                 
                                                                                                                                                                                                   
    export const uploadFile = async (                                                                                                                                                              
      buffer: Buffer,                                                                                                                                                                              
      originalname: string,                                                                                                                                                                        
      folder: string = 'portfolios'                                                                                                                                                                
    ): Promise<string> => {                                                                                                                                                                        
      const uniqueName = `folder/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalname)}`;                                                                                 
                                                                                                                                                                                                   
      const command = new PutObjectCommand({                                                                                                                                                       
        Bucket: bucketName,                                                                                                                                                                        
        Key: uniqueName,                                                                                                                                                                           
        Body: buffer,                                                                                                                                                                              
        ContentType: getMimeType(originalname),                                                                                                                                                    
      })                                                                                                                                                                                           
                                                                                                                                                                                                   
      await s3.send(command)                                                                                                                                                                       
      return uniqueName                                                                                                                                                                            
    }                                                                                                                                                                                              
                                                                                                                                                                                                   
    export const deleteFile = async (key: string): Promise<void> => {                                                                                                                              
      const cleanKey = extractKeyFromUrl(key)                                                                                                                                                      
      if (!cleanKey) return                                                                                                                                                                        
                                                                                                                                                                                                   
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      })
      await s3.send(command)
    }
  
export const getFullUrl = (key: string | null | undefined): string | null => {
      if (!key) return null
      if (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('/')) return key
  
      const endpoint = process.env.MINIO_PUBLIC_URL
      const bucket = process.env.MINIO_BUCKET || 'bucketwebsite'
      const cleanKey = key.startsWith('/') ? key.substring(1) : key
  
      if (endpoint === 'relative') {
        return `/bucket/${cleanKey}`
      }
  
      const activeEndpoint = endpoint || process.env.MINIO_ENDPOINT || 'https://minio-api.oj3nglab.xyz'
      return `${activeEndpoint}/${bucket}/${cleanKey}`
    }
  
    export const extractKeyFromUrl = (urlOrKey: string): string | null => {
      if (!urlOrKey) return null
      if (!urlOrKey.startsWith('http://') && !urlOrKey.startsWith('https://')) {
        return urlOrKey
      }
  
      try {
        const parsed = new URL(urlOrKey)
        const bucket = process.env.MINIO_BUCKET || 'bucketwebsite'
        const prefix = `/${bucket}/`
        if (parsed.pathname.startsWith(prefix)) {
          return decodeURIComponent(parsed.pathname.substring(prefix.length))
        }
        return decodeURIComponent(parsed.pathname.substring(1))
      } catch (err) {
        return urlOrKey
      }
    }
  
    function getMimeType(filename: string): string {
      const ext = path.extname(filename).toLowerCase()
      switch (ext) {
        case '.png': return 'image/png'
        case '.jpg':
        case '.jpeg': return 'image/jpeg'
        case '.webp': return 'image/webp'
        case '.pdf': return 'application/pdf'
        default: return 'application/octet-stream'
      }
    }