import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Login from "./Features/Auth/Login";
import Dashboard from "./Features/Dashboard/Dashboard";

const DataTool = React.lazy(() => import("./Features/DataTool/DataTool"));
const Account = React.lazy(() => import("./Features/Account/Account"));
const PatternLayout = React.lazy(
  () => import("./Features/Patterns/PatternLayout")
);
const ProcessLayout = React.lazy(
  () => import("./Features/Process/ProcessLayout")
);
const ProjectLayout = React.lazy(
  () => import("./Features/project/ProjectLayout")
);

const router: any = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route
          path="store"
          element={
            <React.Suspense
              fallback={
                <>
                  <SkeletonTheme baseColor={"#fff"} highlightColor={"#fefefe"}>
                    <div className="w-[96%] m-8 h-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </SkeletonTheme>
                </>
              }
            >
              <DataTool />
            </React.Suspense>
          }
        />
        <Route
          path="process"
          element={
            <React.Suspense
              fallback={
                <>
                  <SkeletonTheme baseColor={"#fff"} highlightColor={"#eee"}>
                    <div className="w-[95%] m-8 h-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </SkeletonTheme>
                </>
              }
            >
              <ProcessLayout />
            </React.Suspense>
          }
        />
         <Route
          path="accounts"
          element={
            <React.Suspense
              fallback={
                <>
                  <SkeletonTheme baseColor={"#fff"} highlightColor={"#eee"}>
                    <div className="w-[95%] m-8 h-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </SkeletonTheme>
                </>
              }
            >
              <Account />
            </React.Suspense>
          }
        />
        <Route
          path="patterns"
          element={
            <React.Suspense
              fallback={
                <>
                  <SkeletonTheme baseColor={"#fff"} highlightColor={"#eee"}>
                    <div className="w-[95%] m-8 h-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </SkeletonTheme>
                </>
              }
            >
              <PatternLayout />
            </React.Suspense>
          }
        />

        <Route
          path="projects"
          element={
            <React.Suspense
              fallback={
                <>
                  <SkeletonTheme baseColor={"#fff"} highlightColor={"#eee"}>
                    <div className="w-[95%] m-8 h-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </SkeletonTheme>
                </>
              }
            >
              <ProjectLayout />
            </React.Suspense>
          }
        />
      </Route>
    </>
  )
);

export default router;
