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
    def single_transfer(self, params):
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
        self.init(hounds = {},counter = 0, contract_address = contract_address)

    @sp.entry_point
    def createHound(self, params):
        sp.set_type(params.hound.generation, sp.TInt)
        sp.set_type(params.hound.genome, sp.TString)
        token_contract = sp.contract(sp.TRecord(creator = sp.TAddress, metadata = sp.TMap(sp.TString, sp.TBytes),token_id = sp.TNat ), self.data.contract_address, entry_point = "mint").open_some()
        sp.transfer(sp.record(creator = sp.sender, token_id = self.data.counter, metadata = FA2.FA2_token_metadata.make_metadata(
        decimals = 0,
        name = 'Hound NFT',
        symbol = 'Hound'
        )), sp.mutez(0), token_contract)
        self.data.hounds[self.data.counter] = sp.record(token_id = self.data.counter, owner = sp.sender, creator = sp.sender, genome = params.hound.genome, isNew = True, timestamp = params.hound.timestamp, generation = params.hound.generation)
        self.data.counter+=1
    
    @sp.entry_point
    def breed(self, params):
        sp.verify(params.parent1!=params.parent2)
        sp.set_type(params.parent1, sp.TNat)
        sp.set_type(params.parent2, sp.TNat)
        genome1 = self.data.hounds[params.parent1].genome
        genome2 = self.data.hounds[params.parent2].genome
        gen1 = self.data.hounds[params.parent1].generation
        gen2 = self.data.hounds[params.parent2].generation
        genChild = 1 + sp.max(gen1, gen2)
        genomeChild = sp.string("")
        random.seed(int(time.time()))
        for i in range(0,40,4):
            whichParent = random.randint(0,1)
            if whichParent == 0:
                genomeChild += sp.slice(genome1, i, 4).open_some()
            elif whichParent == 1:
                genomeChild += sp.slice(genome2, i, 4).open_some()

        token_contract = sp.contract(sp.TRecord(creator = sp.TAddress, metadata = sp.TMap(sp.TString, sp.TBytes),token_id = sp.TNat ), self.data.contract_address, entry_point = "mint").open_some()
        sp.transfer(sp.record(creator = sp.sender, token_id = self.data.counter, metadata = FA2.FA2_token_metadata.make_metadata(
        decimals = 0,
        name = 'Hound NFT',
        symbol = 'Hound'
        )), sp.mutez(0), token_contract)
        self.data.hounds[self.data.counter] = sp.record(token_id = self.data.counter, owner = sp.sender, creator = sp.sender, genome = genomeChild, isNew = True, timestamp = 1923, generation = genChild)
        self.data.counter+=1

    


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

    def newHound(genome,  generation):
        return sp.record(genome = genome, timestamp = 1343, generation = generation)

    c1.createHound(hound = (newHound("8Bxh1qpQn2Xz6Ip0cAyzAbfLCdlUlPFw4Qzvjk2I", 0))).run(sender = mark)
    c1.createHound(hound = (newHound("0KJh1qxznoPSoIYacvyBAlfYmd14lsvQ4QzvLk2I", 1))).run(sender = mark)
    c1.breed(sp.record(parent1 = sp.nat(0),parent2=sp.nat(1))).run(sender = mark)
    c1.breed(sp.record(parent1 = sp.nat(0),parent2=sp.nat(1))).run(sender = mark)
