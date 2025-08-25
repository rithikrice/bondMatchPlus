from fastapi import FastAPI
import logging

# Routers
from bonds import router as bonds_router
from auctions import router as auctions_router
from health import router as health_router
from rfq import router as rfq_router


app = FastAPI(title="BondMatch++ Auction Engine (In-Memory)", version="0.3")

# Logging config
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# Mount routers
app.include_router(bonds_router, prefix="/bond", tags=["Bonds"])
app.include_router(auctions_router, prefix="/auction", tags=["Auctions"])
app.include_router(rfq_router, prefix="/rfq", tags=["RFQ"])
app.include_router(health_router, prefix="/health", tags=["Health"])
