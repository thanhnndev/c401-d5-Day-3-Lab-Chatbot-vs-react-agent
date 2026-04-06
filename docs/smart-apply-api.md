# Tài liệu Tích hợp SmartApply API

## Thông tin chung
- **Host:** `https://api-v2.smartapply.ca`
- **AgentID:** ENV
- **Token:** ENV

---

## Danh sách API

### 1. Lấy danh sách quốc gia (Get Country list)
- **Path:** `api/zone/country`
- **Method:** `GET`
- **Phản hồi mẫu:**
```json
{
  "statusCode": 200,
  "result": [
    { "_id": "abc", "name": "Viet Nam" }
  ]
}
```

### 2. Lấy danh sách trường học (Get School list)
- **Path:** `api/open-application/{agentID}/school?token={token}`
- **Method:** `GET`
- **Tham số Query:**
  - `search`: string | null
  - `country`: string
  - `page`: 1
- **Phản hồi mẫu:**
```json
{
  "statusCode": 200,
  "result": [
    {
      "_id": "abc",
      "logo": "[https://image.png](https://image.png)",
      "name": "School Name",
      "category": "University", // University, College, High School, English Center, Academy
      "description": "",
      "address": { "country": "", "city": "", "state": "", "street": "" }
    }
  ]
}
```

### 3. Xem chi tiết trường học (Get School detail)
- **Path:** `api/open-application/{agentID}/school/{schoolID}?token={token}`
- **Method:** `GET`
- **Phản hồi mẫu:**
```json
{
  "statusCode": 200,
  "result": {
    "_id": "abc",
    "logo": "[https://image.png](https://image.png)",
    "name": "School Name",
    "category": "University",
    "description": "",
    "address": { "country": "", "city": "", "state": "", "street": "" },
    "content": "",
    "website": "",
    "banner": ""
  }
}
```

### 4. Lấy danh sách chương trình học (Get Program list)
- **Path:** `api/open-application/{agentID}/school/{schoolID}/program?token={token}`
- **Method:** `GET`
- **Tham số Query:**
  - `search`: string | null
  - `page`: 1
- **Phản hồi mẫu:**
```json
{
  "statusCode": 200,
  "result": [
    {
      "_id": "abc",
      "name": "Program Name",
      "intake": ["January", "September"] // Danh sách tháng nhập học
    }
  ]
}
```

### 5. Xem chi tiết chương trình học (Get Program detail)
- **Path:** `api/open-application/{agentID}/program/{programId}?token={token}`
- **Method:** `GET`
- **Phản hồi mẫu:**
```json
{
  "statusCode": 200,
  "result": {
    "_id": "abc",
    "name": "Program Name",
    "intake": ["January", "September"],
    "form": {} // Dữ liệu dùng cho thông tin bổ sung
  }
}
```

### 6. Gửi hồ sơ đăng ký (Submit application)
- **Path:** `api/open-application/{agentID}/application`
- **Method:** `POST`
- **Body mẫu:**
```json
{
  "token": "69ca439f9ffadfa2c498fe2d",
  "student_info": {
    "name": "string",
    "email": "string",
    "student_id": "string",
    "phone": "string",
    "code": "string",
    "address": {
      "country": "string",
      "state": "string",
      "city": "string",
      "street": "string"
    },
    "passport": "string",
    "birthday": "string"
  },
  "parent_info": {
    "name": "",
    "phone": "",
    "email": ""
  },
  "intake": [],
  "program": "{programID}",
  "student_notification": false // Nếu true, hệ thống sẽ gửi email cho sinh viên
}
```
- **Phản hồi mẫu:**
```json
{
  "statusCode": 200,
  "result": {
    "_id": "abc",
    "student_info": { ... }
  }
}