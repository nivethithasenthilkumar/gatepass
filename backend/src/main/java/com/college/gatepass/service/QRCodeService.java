package com.college.gatepass.service;

import com.college.gatepass.model.GatePass;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QRCodeService {
    
    public String generateQRCode(GatePass gatePass) throws WriterException, IOException {
        String qrCodeText = String.format(
            "GATEPASS:%d|STUDENT:%s|NAME:%s|OUT:%s|IN:%s|STATUS:%s",
            gatePass.getId(),
            gatePass.getStudent().getRollNo(),
            gatePass.getStudent().getName(),
            gatePass.getOutDateTime().toString(),
            gatePass.getInDateTime().toString(),
            gatePass.getStatus().toString()
        );
        
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE, 300, 300);
        
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngData);
    }
    
    public String parseQRCode(String qrCodeData) {
        // This would typically use ZXing to decode QR code from image
        // For now, we'll assume the QR code data is passed directly
        return qrCodeData;
    }
}