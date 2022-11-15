import { Request, Response } from "express";

export const ping = (req: Request, res: Response) => {
	res.json({ ok: true });
};
