from store import engine, Subscription
from sqlmodel import SQLModel, Session, select

def check_database():
    # Check if tables exist
    print("Checking database tables...")
    print(f"Tables in database: {SQLModel.metadata.tables.keys()}")
    
    # Try to query the subscription table
    try:
        with Session(engine) as session:
            count = session.exec(select(Subscription)).all()
            print(f"Found {len(count)} subscriptions in the database")
            return True
    except Exception as e:
        print(f"Error accessing subscription table: {e}")
        return False

if __name__ == "__main__":
    if check_database():
        print("✅ Database connection and tables look good!")
    else:
        print("❌ There was an issue with the database")
