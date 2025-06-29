import pymysql

def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Cong@0205",     # Mật khẩu bạn đã cung cấp
        database="QLKho",         # Tên CSDL bạn đã cung cấp
        cursorclass=pymysql.cursors.DictCursor
    )
