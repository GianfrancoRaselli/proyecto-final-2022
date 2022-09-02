import { Fund } from "../generated/schema";
import { NewFund as NewFundEvent } from "../generated/FundFactory/FundFactory";

export function handleNewFund(event: NewFundEvent): void {
  let fund = new Fund(event.params.fundAddress.toHexString());

  fund.name = event.params.name;
  fund.description = event.params.description;
  fund.creator = event.params.creator;
  fund.createdAt = event.params.createdAt;

  fund.save();
}
