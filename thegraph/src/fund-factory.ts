import { BigInt } from "@graphprotocol/graph-ts";
import { NewFund as NewFundEvent } from "../generated/FundFactory/FundFactory";
import { Fund } from "../generated/schema";

export function handleNewFund(event: NewFundEvent): void {
  let fund = new Fund(event.params.fundAddress.toString());

  fund.name = event.params.name.toString();
  fund.description = event.params.description;
  fund.creator = event.params.creator;
  fund.createdAt = event.params.createdAt;

  fund.save();
}
