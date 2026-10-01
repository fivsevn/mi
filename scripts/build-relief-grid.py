import urllib.request,io,math,json
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
from pathlib import Path
size=1024
atlas=Image.new('RGB',(size,size))
def fetch(pair):
 x,y=pair
 with urllib.request.urlopen(f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/2/{x}/{y}.png',timeout=45) as r: return x,y,Image.open(io.BytesIO(r.read())).convert('RGB')
with ThreadPoolExecutor(max_workers=8) as pool:
 for x,y,img in pool.map(fetch,[(x,y) for x in range(4) for y in range(4)]):atlas.paste(img,(x*256,y*256))
pix=atlas.load();values=[]
for row in range(360):
 lat=89.75-row*.5;lat=max(-85.05,min(85.05,lat));yy=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*size
 for col in range(720):
  xx=(col+.5)/720*size;r,g,b=pix[min(size-1,int(xx)),min(size-1,int(yy))];values.append(round((r*256+g+b/256-32768)/50))
# Compact signed base-36 samples; half-degree data is sufficient for the pixel atlas.
def base36(n):
 sign='-' if n<0 else '';n=abs(n);out=''
 while n:out='0123456789abcdefghijklmnopqrstuvwxyz'[n%36]+out;n//=36
 return sign+(out or '0')
(Path(__file__).resolve().parents[1]/'assets/relief-grid.js').write_text('// Mapzen Terrain Tiles / AWS Open Data. SRTM, GMTED and ETOPO1. 0.5 degree samples, 50m units.\nconst rows="'+ ' '.join(map(base36,values))+'";\nconst heights=Int16Array.from(rows.split(" "),v=>parseInt(v,36)*50);\nexport function elevation(lon,lat){const x=((lon+180)*2-.5+720)%720,y=Math.max(0,Math.min(359,(90-lat)*2-.5)),ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;const at=(a,b)=>heights[Math.min(359,b)*720+(a%720)];return (at(ix,iy)*(1-fx)+at(ix+1,iy)*fx)*(1-fy)+(at(ix,iy+1)*(1-fx)+at(ix+1,iy+1)*fx)*fy;}\n')
print('Generated relief samples:',len(values),'range in metres:',min(values)*50,max(values)*50)
