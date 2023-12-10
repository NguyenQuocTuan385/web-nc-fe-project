import { FilterValue } from "components/FilterModal";
import { DataPagination, SortItem } from "models/general";
import { Payment } from "models/payment";
import { memo, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { routes } from "routers/routes";
import Detail from "./Detail";
import Edit from "./Edit";
import List from "./List";

interface Props {}

const PaymentPage = memo(({}: Props) => {
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<Payment>>();
  const [sort, setSort] = useState<SortItem>();
  const [filterData, setFilterData] = useState<FilterValue>({
    paymentMethodIds: [],
    dateRange: {
      startDate: null,
      endDate: null,
    },
  });

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.payment.root}
          render={(props) => (
            <List
              {...props}
              keyword={keyword}
              setKeyword={setKeyword}
              data={data}
              sort={sort}
              setSort={setSort}
              setData={setData}
              filterData={filterData}
              setFilterData={setFilterData}
            />
          )}
        />
        <Route exact path={routes.admin.payment.detail} component={Detail} />
        <Route exact path={routes.admin.payment.edit} component={Edit} />

        <Redirect
          from={routes.admin.payment.root}
          to={routes.admin.payment.root}
        />
      </Switch>
    </>
  );
});

export default PaymentPage;
