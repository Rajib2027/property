import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import AddProperty from "./pages/AddProperty";
import Listing from "./pages/Listing";
import  Property from "./pages/Property";
import InvestorForm from "./pages/InvestorForm";
import FavoritesPage from "./pages/Favourite";
import ShowAddedProperty from "./components/ShowAddedProperty";
import SeekInvestment from "./pages/SeekInvestment";
import ForgetPassword from "./pages/ForgetPassword";
import NewSubmit from "./pages/NewSubmit";
import ShowAllInvestor from "./pages/ShowAllInvestor";
import ShowDraft from "./pages/ShowDraft";
import { BookedPropertiesPage } from "./pages/BookedPropertiesPage";
import InvestmentData from "./pages/InvestmentData";
import ApprovalPage from "./pages/ApprovalPage";
import PropertyCheck from "./pages/PropertyCheck";
import AddImage from "./pages/AddImage";
import ApprovedPages from "./pages/ApprovedPages";
import AdminProfile from "./pages/AdminProfile";
import ProjectAddingPage from "./pages/ProjectAddingPage";
import AllProjects from "./pages/AllProjects";
import ProjectView from "./pages/ProjectView";
import InvestmentView from "./pages/InvestmentView";
import InvestorList from "./pages/InvestorList";
import Footer from "./components/Footer";
import PersonalInfo from "./pages/PersonalInfo";
import PublishedData from "./pages/PublishedData";
import ReferralsPage from "./pages/Referals";
import ViewReferalls from "./pages/ViewReferalls";
import IndividualReferal from "./pages/IndividualReferal";

export default function App() {
  return (
    <BrowserRouter>
    <Header/>

    <Routes>
      <Route  path="/" element={<Home/>}/>
      <Route  path="/sign-in" element={<SignIn/>}/>
      <Route  path="/sign-up" element={<SignUp/>}/>
    
      <Route  path="/forget-password" element={<ForgetPassword/>}/>
      <Route  path="/password-otp" element={<NewSubmit/>}/> 
     
      <Route  path="/about" element={<About/>}/>
     
      <Route  path="/properties" element={<Property/>}/>
      <Route  path="/refs" element={<ReferralsPage/>}/>
      <Route  path="/viewRef" element={<ViewReferalls/>}/>
    
     
      <Route   element={<PrivateRoute/>}>

      <Route  path="/profile" element={<Profile/>}/>
      <Route  path="/personal-info" element={<PersonalInfo/>}/>
      <Route  path="/show-list" element={<ShowAddedProperty/>}/>
      <Route  path="/investor-form" element={<InvestorForm/>}/>
      <Route  path="/seek" element={<SeekInvestment/>}/>
      <Route  path="/show-all" element={<ShowAllInvestor/>}/>
      <Route path="/seek/:projectId" element={<SeekInvestment />} />
      <Route  path="/show-draft" element={<ShowDraft/>}/>
      <Route  path="/listing/:listingId" element={<Listing/>}/>
      <Route  path="/add-property" element={<AddProperty/>}/>
      <Route  path="/fav" element={<FavoritesPage/>}/>
      <Route  path="/approve" element={<ApprovalPage/>}/>
      <Route  path="/booked" element={<BookedPropertiesPage/>}/>
      <Route  path="/investment-data" element={<InvestmentData/>}/>
      <Route path="/property-check/:listingId" element={<PropertyCheck />} />
      <Route path="/add-image" element={<AddImage />} />
      <Route path="/approved" element={<ApprovedPages />} />
      <Route path="/admin-profile" element={<AdminProfile/>} />
      <Route path="/project" element={<ProjectAddingPage/>} />
      <Route path="/all-projects" element={<AllProjects/>} />
      <Route path="/project-view/:listingId" element={<ProjectView/>} />
      <Route path="/investment/:investmentId" element={<InvestmentView/>} />
      <Route path="/allInvest" element={<InvestorList/>} />
      <Route path="/allPublish" element={<PublishedData/>} />
      <Route path="/indRef/:id" element={<IndividualReferal/>} />

      </Route>

    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}
