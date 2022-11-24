# Redis

[Data Type](#Data-type)
[Using Redis](#Using-Redis)

## Data type

### String

    Cấu trúc nhị phân Có thể là string, interger hoặc float

- set >< del
- get >< expire
- incr : >< decr :cộng trừ 1 -> incrby num >< decrby : cộng trừ n
- setnx,mgetnx: set 1 giá trị không thể đổi cho key
- setex: kết hợp giữa set và expire--> set key trong 1 khoảng thời gian n giây
- ttl : kiểm tra thời gian còn lại của 1 key

- keys *: show toàn bộ key đã set>< flushall : xóa toàn bộ key

### list

    Danh sách liên kết các strings
    key element

- lpush : left push value vao array -> rpush >< rpop: nếu list chưa có-> tạo luôn
- lrange: trả về phần tủ trong mảng từ n tới m
- llen: chiều dài của mảng != strlen: length of key
- lset:( key index  element) cài lại từ giá trị thứ index của mảng key.
- linsert (key BEFORE|AFTER element) : thêm phần thử trước/ sau của phần tử đầu tiên bên trái element
- lindex: trả về value  của vị trí thứ index
- lpushx: chi có thể push vào list được tạo sẵn
- ltrim: giữ lại phần tử từ n đến m
- **${\color{red}sort}$** :(key option): sắp xếp theo option : ALPHA:for string sắp xếp theo thứ tự từ điển, DEST: for number nhỏ tới lớn ,LIMIT: giới hạn các phần tử kết hợp với 2 cái trên, BY
- blpop: xóa  phần tử đầu của list

### sets

    Tập hợp các string( không được sắp xếp)
    key member

- sadd:>< SREM tương tự lpush/rpush nhưng không trùng phần tử
- smembers : tương tự như lrange nhưng dành cho sadd
- scard : tươn tự llen/ strlen nhưng cho sadd
- sismember: kiểm tra tồn tại trong list
- sdiff (key1 key 2): trả về phần tử key1 khác key2 >< sinter:chung
- sdiffstore : tương tự sdiff nhưng trả về list mới
- sunion: gop nhieu  key xóa trùng--> sunionstore,differene

### sorted sets

    Là danh sách mỗi map là 1 score và value danh sach dc sắp xếp theo score
    key  number|value

- zadd: tương tự sadd Nhưng có thứ thự num:key
- zrange: show phan tu
- zcard : count element
- zcount: đếm số elentment đã set number trong min đến max
- zrank :>< zrevrank
- zrevrange: sắp xếp theo phần tử from-to
- zrevrangebyscore: sắp xếp theo score max:min
- zscore: find number of key

### Hyperloglog

    Cấu trúc dữ liệu xác suất được sử dụng để đếm các giá trị duy nhất với kích thước bộ nhớ không đổi
    key element

- pfadd
- pdfcount: count element
- pfmerge : tao 1 list moi chua 2 list

### hashes

    Lưu trữ theo key- value, key được săp xếp ngẫu nhiên
    key field value

- hset: Lưu trừ nhiều thuộc tính(field) cho key
- hkeys : trả về các field đã lưu trong key
- hvals: trar về vals  đã trong field
- hgetall : cả 2 cái trên
- hexists :check  tồn tại của field
- hlen : count field of hash
- hincrby: cộng vào 1 field một gia trị n

### Streams

    Quản lý các luồng dữ liệu tốc độ cao. Có khả năng phân vùng độc lập, nhân bản và ổn định 
    key id field value

- xadd
- xread
- xrange
- xlen

### Geospatial

    Dùng để lưu tọa độ

- geoadd
- geosearch

### Bitmaps

    Cấu trúc dữ liệu có kích thước nhỏ, có thể lưu trữ các trạng thái là logic nhị phân

    Có thể sử dụng AND, OR, XOR, NOT

- setbit
- getbit
- bitop

### Bitfields

    Cung cấp 1 phương thức hiệu quả, nhỏ gọn để triển khai nhiều bộ đếm trong 1 mảng

- Bitfield
- Bitfield_ro

## Using Redis

### Pub/Sub

![pub-sub](./img/pub-%20sub.png)

- pub(publish): publisher se đẩy data vào một hoặc nhiều topic(channel).
- sub(subscribe): subscriber sẽ đăng kí nhận data từ một hay nhiều topic

  - subscribe channel --> psubscribe : theo dõi các channel không cụ thể vd : h?llo sẽ theo dõi hallo, hollo,...
  - pubsb : kiểm tra các ... đang tồn tại(numsub: số  lượng sub cảu channel, channels : số lượng channel đang tồn tịa)


  ==> giải pháp tuyệt vời cho chat-app nhưng tính bảo mật bằng 0 khi gặp psubscribe :D

### Transactions

- multi: các lệnh tiếp theo sẽ vào hàng đợi chỉ được thự hiện khi dùng exec
- exec : chạy các lệnh đang chờ
- discard: xóa các lệnh trong hàng chờ

### Redis Scripts

- eval :  gọi thực thi từ phía máy chủ

## Đặc trưng của redis

- Dữ iệu có thể đặt hết hạn
- In-memory: lưu trữ dữ liệu trên ram-->  sau đó lưu trữ trên ổ cứng: RDB và AFO
  - RDB (redis database) : thực hiện snapshot
  - AOF (append only file): viết lại mọi thao tác ghi mà server nhận được, chay mỗi khi khởi động

### ưu điểm

- Tốc dộ cực nhanh
- Dễ thiết lập và sử dụng
- Hỗ trợ nhiều cấu trúc dữ liệu linh hoạt
- Cho phép lưu trữ key-value kích thuosc lớn 512mb
- Cơ chế hash riêng  redis hashing
- Không bị downtime và ảnh hưởng hiệu suất khi thay đổi quy mô
- Mã nguồn mở, ổn định
- Hỗ trợ nhiều ngôn ngữ

### nhược điểm

- Dữ liệu được chia sẻ dựa trên các vị trí hash gán cho từng master, vì vậy master đang giữ slot gặp trục trặc thì dữ liệu cũng mất.
- Client kết nối đến các cluster redis cũng nên chú ý đến cấu trúc liên kết cụm
- Cần nhiều ram vì cơ chế in-memory

## Faceted Search
## Object Storage 
 Có thể sử dụng '.' cho objecr và [num] cho aray
 ```json
 {
    "colour":"blue",
    "make":"saab",
    "model":{
       "trim" : "aero",
       "name" : 93
    },
    "features":[ "powerlocks", "moonroof" ]
}
 ```

> HSET car3 model.trim aero
> HSET car3 model.name 93
> HSET car3 features[0] powerlocks
> HSET car3 features[1] moonroo

## Data modeling
    First, it’s worth noting that one-to-many and many-to-many use both the Embedded and the Partial Embed Pattern.
one to one
    Sử dụng nhúng

one to many

Many to Many