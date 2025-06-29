import pymysql

def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Khanhminh29!",     # Mật khẩu bạn đã cung cấp
        database="qlkho",         # Tên CSDL bạn đã cung cấp
        cursorclass=pymysql.cursors.DictCursor
    )
