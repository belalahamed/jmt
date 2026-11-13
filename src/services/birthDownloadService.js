import axios from "axios";
import createFormData from "../utils/formData.util.js";

const REQUEST_TOKEN =
  "m9yJfrsK8EJG6xT-EFxfaTGrnf37B93sFv0_83dRkTN90B7lf7wVCijLBs5R1qlGWSo1X2iVqZwKfSYdBn7eckyZcV8DVSEp9EqeOVEHK4Y1";
const COOKIE =
  "xehfcdjly=RS_janmamrityu_02; WBJMTCRSRTB=p3iqqpm5p40axt0hrkccojzr; xehfcdjly=RS_janmamrityu_02; __RequestVerificationToken=Vg0B6QQLsTzZrACAc1RB2JgOCVjRC7x23Y8CM-YWfDn5yUWips1GADBqDNJU3b2PGILSbjH4Xvarfculx4UoIKeUdx5EN-BIJtGeDGlvYOY1";
const BASE_URL = "https://janma-mrityutathya.wb.gov.in";

class BirthDownloadService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      withCredentials: false,
    });
  }

  async getAcknowledgementNo(
    yearOfBirth,
    monthOfBirth,
    motherFirstName,
    birthCertificateNo,
  ) {
    try {
      const queryParams = {
        YearId: yearOfBirth,
        Monthid: monthOfBirth,
        BabyName: "",
        MotherName: motherFirstName,
        FatherName: "",
        MobileNo: "",
        _: "",
      };

      const response = await this.api.get(
        "/Account/GetknowyourApplicationList",
        { params: queryParams },
      );

      const responseData = response.data;
      const birthRecords = responseData.data;

      const birthRecord = birthRecords.find((birthRecord) =>
        birthRecord.RegistraionNo.includes(birthCertificateNo),
      );

      return birthRecord.AcknowledgementNo;
    } catch (error) {
      console.error("Error getting acknowledgement no: ", error.message);
      throw error;
    }
  }

  async getEncodeId(dateOfBirth, acknowledgementNo) {
    try {
      const formData = createFormData({
        __RequestVerificationToken: REQUEST_TOKEN,
        acknowledgementnumber: acknowledgementNo,
        dobOrDob: dateOfBirth,
        type: "1",
      });

      const requestHeaders = {
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest",
        Origin: BASE_URL,
        Referer: BASE_URL + "/",
        Cookie: COOKIE,
      };

      const response = await this.api.post(
        "/BirthCitizen/GetTrackApplicationNew",
        formData,
        {
          withCredentials: false,
          headers: requestHeaders,
        },
      );

      const responseData = response.data;
      const encodeId = responseData.data.EncodeID;

      return encodeId;
    } catch (error) {
      console.error("Error getting encode id: ", error.message);
      throw error;
    }
  }

  async getBirthCertificatePDF(encodeId) {
    try {
      const response = await this.api.get(`/Birth?id=${encodeId}`, {
        responseType: "arraybuffer",
      });

      const birthCertificatePDFData = response.data;

      return birthCertificatePDFData;
    } catch (error) {
      console.error("Error getting birth certificate: ", error.message);
      throw error;
    }
  }

  async downloadBirthCertificate(
    dateOfBirth,
    motherFirstName,
    birthCertificateNo,
  ) {
    try {
      const [, monthOfBirth, yearOfBirth] = dateOfBirth.split("/");

      const acknowledgementNo = await this.getAcknowledgementNo(
        yearOfBirth,
        monthOfBirth,
        motherFirstName,
        birthCertificateNo,
      );

      const encodeId = await this.getEncodeId(dateOfBirth, acknowledgementNo);

      const birthCertificatePDF = await this.getBirthCertificatePDF(encodeId);

      return birthCertificatePDF;
    } catch (error) {
      console.error("Error downloading birth certificate: ", error.message);
      throw error;
    }
  }
}

export default BirthDownloadService;
