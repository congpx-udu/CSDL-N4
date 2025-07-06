import pymysql

def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Khanhminh29!",     
        database="qlkho",        
        cursorclass=pymysql.cursors.DictCursor
    )
