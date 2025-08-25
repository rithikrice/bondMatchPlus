# Shared in-memory state

# Bonds listed in the system
bonds = {}
micro_bonds = {} 

# Auctions (auction_id -> auction details)
auctions = {}

# Orders (order_id -> order details)
orders = {}

# Fills (execution details)
fills = {}

# Audit log for compliance
audit_events = []

# RFQs (rfq_id -> rfq details)
rfqs = {}
