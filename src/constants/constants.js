export const AUTH_REDIRECTION_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}authorize`;

export const SIGNEASY_REDIRECTION_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}oauth/signeasy?only_signeasy=true`;

const envelopes = {
  pending: 1,
  completed: 1,
  voided: 2,
  declined: 0,
  envelopes: [
    {
      uuid: "3687d179-901d-4133-a949-691eb3b1454c",
      envelope_id: 5936604,
      name: "Try it now - demo.pdf",
      status: "voided",
      updatedAt: "2023-05-11T09:55:53.892Z",
      recipients: [
        {
          email: "ankitk-t@signeasy.com",
          status: "declined",
          last_name: "Kamboj",
          updatedAt: "2023-05-11 09:55:54.25+00",
          first_name: "Ankit",
        },
      ],
    },
    {
      uuid: "3d4074f9-a6a0-46c8-acae-ff060395b013",
      envelope_id: 5931281,
      name: "nda-1234_07_Apr_2023-075444",
      status: "pending",
      updatedAt: "2023-05-11T09:49:16.016Z",
      recipients: [
        {
          email: "ankitk-t@signeasy.com",
          status: "not_viewed",
          last_name: "Kamboj",
          updatedAt: "2023-05-11 09:49:16.27+00",
          first_name: "Ankit",
        },
        {
          email: "test@test.com",
          status: "not_viewed",
          last_name: "Testing",
          updatedAt: "2023-05-11 09:49:16.27+00",
          first_name: "Test",
        },
      ],
    },
    {
      uuid: "613a545a-9f2a-40a9-b55b-ddd44b52ae91",
      envelope_id: 5931379,
      name: "test.pdf",
      status: "completed",
      updatedAt: "2023-05-11T07:05:09.004Z",
      recipients: [
        {
          email: "ankitk-t@signeasy.com",
          status: "finalized",
          last_name: "",
          updatedAt: "2023-05-11 07:05:09.25+00",
          first_name: "Ankit Kamboj",
        },
      ],
    },
    {
      uuid: "702930d6-a807-48c0-92dc-cedae0e7cdb5",
      envelope_id: 5936618,
      name: "Basic-Non-Disclosure-Agreement-Test.pdf",
      status: "voided",
      updatedAt: "2023-05-11T07:11:53.205Z",
      recipients: [
        {
          email: "ankitk-t@signeasy.com",
          status: "not_viewed",
          last_name: "Kamboj",
          updatedAt: "2023-05-11 07:11:53.403+00",
          first_name: "Ankit",
        },
      ],
    },
  ],
};
