package com.aziz.security.notification.sms.service;

import com.aziz.security.notification.sms.config.TwilioConfig;
import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.twilio.rest.api.v2010.account.Message;

@RequiredArgsConstructor
@Service

public class TwilioSmsService {

    private final TwilioConfig twilioConfig;
    public void sendSms(String number,String message1) {


            PhoneNumber to = new PhoneNumber("+216"+number);
            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber());
            Message message = Message
                    .creator(to, from,
                            message1)
                    .create();


    }
}
