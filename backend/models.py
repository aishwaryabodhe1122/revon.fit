
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class ContactForm(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str
    whatsapp: str | None = None
    query: str = Field(min_length=10, max_length=2000)
    agree: bool

class SubscribeForm(BaseModel):
    email: EmailStr

class BlogIn(BaseModel):
    title: str
    excerpt: str
    content: str
    tags: List[str] = []

class BlogOut(BaseModel):
    id: int
    title: str
    excerpt: str
    content: str
    tags: List[str] = []
    published_date: datetime

class Service(BaseModel):
    id: str
    title: str
    price: str
    tags: List[str] = []
    summary: str
    details: str
