package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import database.tables.EditUsersTable;
import database.tables.CheckForDuplicatesExample;
import mainClasses.User;
import java.sql.SQLException;

/**
 *
 * @author
 */
public class NewServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Set response content type
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // Check if it's a username availability check
            String usernameCheck = request.getParameter("username_check");
            if (usernameCheck != null && usernameCheck.equals("true")) {
                String username = request.getParameter("username");
                CheckForDuplicatesExample checker = new CheckForDuplicatesExample();
                boolean isAvailable = checker.isUserNameAvailable(username);

                if (isAvailable) {
                    response.setContentType("text/plain;charset=UTF-8");
                    out.write("available");
                } else {
                    response.setContentType("text/plain;charset=UTF-8");
                    out.write("unavailable");
                }
                return; // Stop further processing
            }

            // Else, it's a form submission
            // Retrieve form parameters
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String firstname = request.getParameter("firstname");
            String lastname = request.getParameter("lastname");
            String birthdate = request.getParameter("birthdate");
            String gender = request.getParameter("gender");
            String afm = request.getParameter("afm");
            String country = request.getParameter("country");
            String address = request.getParameter("address");
            String municipality = request.getParameter("municipality");
            String prefecture = request.getParameter("prefecture");
            String job = request.getParameter("job");
            String telephone = request.getParameter("telephone");
            String latStr = request.getParameter("lat");
            String lonStr = request.getParameter("lon");

            double lat = latStr != null && !latStr.isEmpty() ? Double.parseDouble(latStr) : 0.0;
            double lon = lonStr != null && !lonStr.isEmpty() ? Double.parseDouble(lonStr) : 0.0;

            // Check if username is available
            CheckForDuplicatesExample checker = new CheckForDuplicatesExample();
            boolean isAvailable = checker.isUserNameAvailable(username);

            if (!isAvailable) {
                // Username not available
                response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
                out.write("{\"message\":\"Το username δεν είναι διαθέσιμο.\"}");
                return;
            }

            // Create new User object
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setFirstname(firstname);
            user.setLastname(lastname);
            user.setBirthdate(birthdate);
            user.setGender(gender);
            user.setAfm(afm);
            user.setCountry(country);
            user.setAddress(address);
            user.setMunicipality(municipality);
            user.setPrefecture(prefecture);
            user.setJob(job);
            user.setTelephone(telephone);
            user.setLat(lat);
            user.setLon(lon);

            // Add user to database
            EditUsersTable eut = new EditUsersTable();
            eut.addNewUser(user);

            // Send success response
            response.setStatus(HttpServletResponse.SC_OK);
            out.write("{\"message\":\"Η εγγραφή ολοκληρώθηκε με επιτυχία.\"}");

        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"message\":\"Σφάλμα στον διακομιστή.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"message\":\"Μη έγκυρα δεδομένα.\"}");
        } finally {
            out.close();
        }
    }

    // Handles the HTTP POST method.
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}
