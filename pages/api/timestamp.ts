
export default function handler(req:any, res:any) {
    res.status(200).json({ timestamp: new Date().getTime() / 1000 });
  }