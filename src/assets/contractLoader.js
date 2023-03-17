import contract from "@truffle/contract"

async function loadContract(name, provider) => {
    const res =  await fetch(`./build/${name}.json`)
    const Artifact = await res.json()

    const _contract = contract(Artifact)
    _contract.setProvider(provider)

    const deployedContract = await _contract.deployed()

    return deployedContract
}