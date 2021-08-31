#BitHounds - A decentralized trading card game
import smartpy as sp

class BitHounds(sp.Contract):
    def __init__(self, admin, newAuctionDuration, breedingDuration):
        self.newAuctionDuration = newAuctionDuration
        self.breedingDuration = breedingDuration
        self.init(hounds = {}, admin = admin)

    @sp.entry_point
    def create(self, params):
        sp.verify(self.data.admin == sp.sender)
        sp.verify(params.hound.isNew)
        sp.set_type(params.hound.houndId, sp.TInt)
        self.data.hounds[params.hound.houndId] = params.hound
    
    @sp.entry_point
    def destroy(self, params):
        sp.verify(self.data.admin == sp.sender)
        hound = self.data.hounds[params.hound1]
        self.checkAvailable(hound, params)
        del hound
        
    @sp.entry_point
    def breed(self, params):
        parent1 = params.parent1
        parent2 = params.parent2
        hound1 = self.data.hounds[parent1]
        hound2 = self.data.hounds[parent2]
        sp.verify(parent1 != parent2)
        self.checkAvailable(hound1, params)
        self.checkAvailable(hound2, params, hound2.owner != sp.sender)
        breeding = sp.now.add_seconds(self.breedingDuration)
        hound1.breeding = breeding
        hound2.breeding = breeding
        hound = self.newHound(params.houndId, breeding, 1 + sp.max(hound1.generation, hound2.generation))
        self.data.hounds[hound.houndId] = hound

    @sp.entry_point
    def sell(self, params):
        sp.verify(sp.mutez(0) <= params.price)
        self.checkAvailable(self.data.hounds[params.houndId], params)
        self.data.hounds[params.houndId].price = params.price

    @sp.entry_point
    def lend(self, params):
        sp.verify(sp.mutez(0) <= params.price)
        self.checkAvailable(self.data.hounds[params.houndId], params)
        self.data.hounds[params.houndId].borrowPrice = params.price

    @sp.entry_point
    def buy(self, params):
        hound = self.data.hounds[params.houndId]
        sp.verify(sp.mutez(0) < hound.price)
        sp.verify(hound.price <= params.price)
        sp.verify(sp.amount == params.price)
        sp.send(hound.owner, params.price)
        hound.owner = sp.sender
        sp.if hound.isNew:
            hound.isNew = False
            hound.auction = sp.now.add_seconds(self.newAuctionDuration)
        sp.verify(sp.now <= hound.auction)
        sp.if sp.now <= hound.auction:
            hound.price = params.price + sp.mutez(1)

    def checkAvailable(self, hound, params, borrow = False):
        sp.if borrow:
            sp.verify(sp.mutez(0) < hound.borrowPrice)
            borrowPrice = params.borrowPrice
            sp.verify(hound.borrowPrice < borrowPrice)
            sp.verify(sp.amount == borrowPrice)
            sp.send(hound.owner, borrowPrice)
        sp.verify(hound.auction < sp.now)
        sp.verify(hound.breeding < sp.now)

    def newHound(self, houndId, breeding, generation):
        return sp.record(houndId = houndId, owner = sp.sender, price = sp.mutez(0), isNew = False, auction = sp.timestamp(0), breeding = breeding, generation = generation, borrowPrice = sp.mutez(0))

@sp.add_test(name = "BitHounds")
def test():
    admin = sp.test_account("Admin")
    mihir = sp.test_account("Mihir")
    srijan = sp.test_account("Srijan")

    c1 = BitHounds(admin.address, newAuctionDuration = 10, breedingDuration = 100)
    scenario  = sp.test_scenario()
    scenario.h1("Bit Hounds")
    scenario += c1
    def newHound(houndId, price):
        return sp.record(houndId = houndId, owner = admin.address, price = sp.mutez(price), isNew = True, auction = sp.timestamp(0), breeding = sp.timestamp(0), generation = 0, borrowPrice = sp.mutez(0))
    c1.create(hound = newHound(0, 10)).run(sender = admin)
    c1.create(hound = newHound(1, 10)).run(sender = admin)
    c1.create(hound = newHound(2, 10)).run(sender = admin)
    c1.create(hound = newHound(3, 10)).run(sender = admin)
    c1.buy(  houndId = 1, price = sp.mutez(10)).run(sender = mihir, amount = sp.mutez(10))
    c1.buy(  houndId = 2, price = sp.mutez(10)).run(sender = mihir, amount = sp.mutez(10))
    c1.buy(  houndId = 1, price = sp.mutez(11)).run(sender = srijan, amount = sp.mutez(11), now = sp.timestamp(3))
    c1.buy(  houndId = 1, price = sp.mutez(15)).run(sender = mihir, amount = sp.mutez(15), now = sp.timestamp(9))
    scenario.h2("A bad execution")
    c1.buy(  houndId = 1, price = sp.mutez(20)).run(sender = srijan, amount = sp.mutez(20), now = sp.timestamp(13), valid = False)
    scenario.h2("breeding")
    c1.breed(borrowPrice = sp.mutez(10), houndId = 4, parent1 = 1, parent2 = 2).run(sender = mihir, now = sp.timestamp(15))
