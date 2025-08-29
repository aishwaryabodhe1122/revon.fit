from store import engine, Subscription, SQLModel
from sqlmodel import Session, select

def migrate_subscription_table():
    # Drop the existing subscription table if it exists
    Subscription.__table__.drop(engine, checkfirst=True)
    
    # Recreate the table with the current schema
    Subscription.metadata.create_all(engine)
    
    print("✅ Subscription table has been recreated with the correct schema")

if __name__ == "__main__":
    migrate_subscription_table()
    
    # Verify the table was created correctly
    with Session(engine) as session:
        count = session.exec(select(Subscription)).all()
        print(f"Subscription table now has {len(count)} records")
