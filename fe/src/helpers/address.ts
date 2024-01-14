export class AddressHelper {
  static getWardDistrict(address: string) {
    // Biểu thức chính quy để tìm phường và quận
    var regex = /Phường\s([^,]+),\sQuận\s([^,]+)/;

    // Sử dụng biểu thức chính quy để tìm kiếm phường và quận trong địa chỉ
    var match = address.match(regex);

    // Kiểm tra xem có kết quả hay không
    if (match && match.length === 3) {
      // match[1] chứa tên phường, match[2] chứa tên quận
      var ward = match[1].trim();
      var district = match[2].trim();

      return { ward: ward, district: district };

      // Bạn có thể trả về kết quả theo nhu cầu của mình
      // return { ward: ward, district: district };
    } else {
      console.log("Không tìm thấy thông tin phường và quận trong địa chỉ.");
      // Hoặc trả về một giá trị mặc định hoặc xử lý khác tùy thuộc vào yêu cầu của bạn
    }
  }
}
