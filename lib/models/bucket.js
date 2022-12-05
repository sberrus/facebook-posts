"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("firebase-admin/storage");
/**
 * Bucket controller to get assets from server
 */
class BucketController {
    constructor() {
        /** todo: Crear peticion con axios para obtener el blob y devolverlo para que pueda usarlo facebook. */
        // public getImage = async () => {
        // 	try {
        // 		const dateExp = new Date();
        // 		dateExp.setHours(dateExp.getHours() + 1);
        // 		console.log("Url expira en: ", dateExp);
        // 		const url = await this.bucket
        // 			.file("Captura de pantalla_20221124_013328.png")
        // 			.getSignedUrl({ action: "read", expires: dateExp });
        // 		console.log(url);
        // 	} catch (error) {
        // 		console.log(error);
        // 	}
        // };
        this.getImage = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield this.bucket.file("Captura de pantalla_20221124_013328.png").download();
                return file;
            }
            catch (error) {
                console.log(error);
            }
        });
        // initialize bucket
        this.bucket = (0, storage_1.getStorage)().bucket();
        //
        this.getImage();
    }
}
exports.default = BucketController;
//# sourceMappingURL=bucket.js.map