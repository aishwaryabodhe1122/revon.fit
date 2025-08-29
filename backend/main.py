from fastapi import FastAPI, Body, HTTPException, Header, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
import jwt
from settings import ADMIN_EMAIL, JWT_SECRET
from email_util import send_email
from auth import issue_otp, verify_otp_and_issue_token, is_authorized_identifier, normalize_identifier
from store import contacts_create, contacts_list, contacts_delete, blogs_create, blogs_list, services_list, services_create, services_update, services_delete, create_subscription, subscriptions_list, subscription_delete

app = FastAPI(title="Revon.Fit API", version="2.0.0")

# Enhanced CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

def require_bearer(token: Optional[str] = Header(default=None, alias="Authorization")):
    if not token or not token.startswith("Bearer "): raise HTTPException(status_code=401, detail="Missing token")
    token = token.split(" ",1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role")!="admin": raise HTTPException(status_code=403, detail="Forbidden")
        return payload
    except jwt.PyJWTError: raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/auth/request-otp")
def auth_request_otp(payload: Dict[str,str] = Body(...), request: Request = None):
    identifier = normalize_identifier(payload.get("identifier",""))
    if not identifier: raise HTTPException(status_code=400, detail="Identifier required")
    if not is_authorized_identifier(identifier):
        ip = request.client.host if request and request.client else "unknown"
        send_email(ADMIN_EMAIL, "Unauthorized Admin Login Attempt", f"Attempted identifier: {identifier}\nIP: {ip}")
        raise HTTPException(status_code=401, detail="Unauthorized Credentials!")
    issue_otp(identifier); return {"status":"otp_sent"}

@app.post("/api/auth/verify-otp")
def auth_verify_otp(payload: Dict[str,str] = Body(...)):
    identifier = normalize_identifier(payload.get("identifier","")); otp = payload.get("otp","")
    token = verify_otp_and_issue_token(identifier, otp)
    if not token: raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"token": token}

@app.post("/api/contact")
def create_contact(payload: Dict[str,Any] = Body(...)):
    if not payload.get("agree"): raise HTTPException(status_code=400, detail="Consent required")
    data = { "name":payload.get("name",""), "email":payload.get("email",""), "phone":payload.get("phone",""), "whatsapp":payload.get("whatsapp"), "query":payload.get("query","") }
    _id = contacts_create(data); return {"status":"ok", "id":_id}

@app.get("/api/blogs")
def public_blogs(): return blogs_list()

@app.get("/api/services")
def public_services(): return services_list()

@app.get("/api/admin/contacts")
def admin_contacts(user=Depends(require_bearer)): return contacts_list()

@app.delete("/api/admin/contacts/{id_}")
def admin_contacts_delete(id_: str, user=Depends(require_bearer)):
    if not contacts_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}

@app.post("/api/admin/blogs")
def admin_blog_create(payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    for k in ["title","excerpt","content"]:
        if not payload.get(k): raise HTTPException(status_code=400, detail="Missing fields")
    _id = blogs_create({"title":payload["title"], "excerpt":payload["excerpt"], "content":payload["content"], "tags": payload.get("tags", [])})
    return {"status":"ok", "id":_id}

@app.get("/api/admin/services")
def admin_services(user=Depends(require_bearer)): return services_list()

@app.post("/api/admin/services")
def admin_service_create(payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    for k in ["title","price","summary","details"]:
        if not payload.get(k): raise HTTPException(status_code=400, detail="Missing fields")
    _id = services_create({"title":payload["title"],"price":payload["price"],"summary":payload["summary"],"details":payload["details"],"tags":payload.get("tags",[])})
    return {"status":"ok","id":_id}

@app.put("/api/admin/services/{id_}")
def admin_service_update(id_: str, payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    if not services_update(id_, payload): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"updated"}

@app.delete("/api/admin/services/{id_}")
def admin_service_delete(id_: str, user=Depends(require_bearer)):
    if not services_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}

@app.get("/api/admin/subscriptions")
def admin_subscriptions_list(user=Depends(require_bearer)):
    return subscriptions_list()

@app.delete("/api/admin/subscriptions/{id_}")
def admin_subscription_delete(id_: int, user=Depends(require_bearer)):
    if not subscription_delete(id_):
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"status": "deleted"}

@app.post("/api/subscribe")
async def subscribe(payload: Dict[str, str] = Body(...)):
    try:
        email = payload.get("email")
        if not email or "@" not in email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valid email is required"
            )
        
        result = create_subscription(email)
        
        # Send confirmation email
        try:
            send_email(
                email,
                "Subscription Confirmed - Revon.Fit",
                f"Thank you for subscribing to Revon.Fit!\n\n"
                f"We'll keep you updated with our latest news and offers.\n\n"
                f"If this wasn't you, please ignore this email."
            )
        except Exception as e:
            print(f"Failed to send subscription email: {e}")
            # Don't fail the request if email sending fails
        
        return result
        
    except Exception as e:
        print(f"Error in subscribe endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your subscription"
        )
