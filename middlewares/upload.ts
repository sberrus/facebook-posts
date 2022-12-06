import util from "util";
import Multer from "multer";

const maxSize = 15 * 1024 * 1024;

const processFile = Multer({
	storage: Multer.memoryStorage(),
	limits: { fileSize: maxSize },
}).single("file");

const processFileMiddleware = util.promisify(processFile);

export default processFileMiddleware;
