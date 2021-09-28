#BitHounds - A decentralized trading card game
import smartpy as sp
import time
import random
FA2 = sp.io.import_template("FA2.py")

class NFT(FA2.FA2):

    @sp.entry_point
    def mint(self, params):
        if self.config.non_fungible:
            sp.verify(
                ~ self.token_id_set.contains(self.data.all_tokens, params.token_id),
                message = "NFT-asset: cannot mint twice same token"
            )
        user = self.ledger_key.make(params.creator, params.token_id)
        self.token_id_set.add(self.data.all_tokens, params.token_id)
        sp.if self.data.ledger.contains(user):
            self.data.ledger[user].balance += 1
        sp.else:
            self.data.ledger[user] = FA2.Ledger_value.make(1)
        sp.if self.data.token_metadata.contains(params.token_id):
            if self.config.store_total_supply:
                self.data.total_supply[params.token_id] = 1
        sp.else:
            self.data.token_metadata[params.token_id] = sp.record(
                token_id    = params.token_id,
                token_info  = params.metadata
            )
            if self.config.store_total_supply:
                self.data.total_supply[params.token_id] = 1

    @sp.entry_point
    def transfer(self, params):
        current_from = params.from_
        if self.config.single_asset:
            sp.verify(params.token_id == 0, message = "single-asset: token-id <> 0")
        sp.verify(
            self.data.token_metadata.contains(params.token_id),
            message = self.error_message.token_undefined()
        )
        from_user = self.ledger_key.make(current_from, params.token_id)
        sp.verify(
            (self.data.ledger[from_user].balance >= 1),
            message = self.error_message.insufficient_balance())
        to_user = self.ledger_key.make(params.to_, params.token_id)
        self.data.ledger[from_user].balance = sp.as_nat(
            self.data.ledger[from_user].balance - 1)
        sp.if self.data.ledger.contains(to_user):
            self.data.ledger[to_user].balance += 1
        sp.else:
                self.data.ledger[to_user] = FA2.Ledger_value.make(1)
                

class Hound(sp.Contract):
    def __init__(self, contract_address):
        self.init(hounds = {}, market = {}, counter = 0, contract_address = contract_address)

    @sp.entry_point
    def createHound(self, params):
        sp.set_type(params.generation, sp.TInt)
        sp.set_type(params.genome, sp.TString)
        token_contract = sp.contract(sp.TRecord(creator = sp.TAddress, metadata = sp.TMap(sp.TString, sp.TBytes),token_id = sp.TNat ), self.data.contract_address, entry_point = "mint").open_some()
        sp.transfer(sp.record(creator = sp.sender, token_id = self.data.counter, metadata = FA2.FA2_token_metadata.make_metadata(
        decimals = 0,
        name = 'Hound NFT',
        symbol = 'Hound'
        )), sp.mutez(0), token_contract)
        self.data.hounds[self.data.counter] = sp.record(token_id = self.data.counter, owner = sp.sender, creator = sp.sender, genome = params.genome, onSale = False, timestamp = params.timestamp, generation = params.generation, price = sp.mutez(0))
        self.data.counter+=1

    @sp.entry_point
    def sell(self, params):
        hound = self.data.hounds[params.hound_id]
        sp.verify(hound.owner == sp.sender)
        hound.onSale = True
        hound.price = params.price
        self.data.market[hound.token_id] = hound

    @sp.entry_point
    def buy(self, params):
        hound = self.data.hounds[params.hound_id]
        sp.verify(hound.onSale == True)
        sp.verify(sp.amount == hound.price)
        sp.send(hound.owner, sp.amount)
        token_contract = sp.contract(sp.TRecord(from_ = sp.TAddress, to_ = sp.TAddress, token_id = sp.TNat), self.data.contract_address, entry_point = "transfer").open_some()
        sp.transfer(sp.record(from_ = hound.owner, to_ = sp.sender, token_id = params.hound_id), sp.mutez(0), token_contract)
        hound.owner = sp.sender
        hound.onSale = False
        del self.data.market[hound.token_id]

    


@sp.add_test(name = "Test Hounds")
def test():
    admin = sp.address("tz1bm9dFuBnSzTzgZKuHjJsFfrPfdkVgj1PW")
    mark = sp.test_account("Mark")
    bill = sp.test_account("Bill")
    scenario  = sp.test_scenario()
    scenario.h1("Hounds")
    nft = NFT(FA2.FA2_config(non_fungible = True), admin = admin, metadata = sp.big_map({"": sp.utils.bytes_of_string("tezos-storage:content"),"content": sp.utils.bytes_of_string("""{"name" : "Hound", "author": "Test", "status": "Dev"}""")}))
    scenario += nft
    c1 = Hound(nft.address)
    scenario += c1  

    c1.createHound(genome = "8Bxh1qpQn2Xz6Ip0cAyzAbfLCdlUlPFw4Qzvjk2I", generation = 0, timestamp = 1324).run(sender = mark)
    c1.createHound(genome = "otQMyicGthNPFnv52tmf8wUW7yRLqxTFFQ4Eisji", generation = 1, timestamp = 1532).run(sender = mark)
    c1.sell(hound_id = 1, price = sp.mutez(21)).run(sender = mark)
    c1.buy(hound_id = 1).run(sender = bill, amount=sp.mutez(21))