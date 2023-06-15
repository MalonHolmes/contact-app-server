// more...
const request = require('supertest'); // fakes external requests
const appBuilder = require('../appBuilder');

describe('POST /contact', () => {
    let mockDatabase;
    let testApp;

    // creates mock data before each test...ya dig?
    beforeEach(() => {
        mockDatabase = {
            createContact: jest.fn(),
        };
        testApp = appBuilder(mockDatabase);
    });

    // testing for missing fields 
    it('should respond with 400 for missing fields', async () => {
        const response = await request(testApp)
            .post('/contact') 
            .send({}); // sends nothing to the db, which is what we're testing
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Required fields are missing',
        });
    });
    
    it('should respond with 201 for success', async () => {
        const mockId = 1;
        mockDatabase.createContact.mockResolvedValue(mockId);

        const response = await request(testApp)
            .post('/contact')
            .send({
                firstName: "Malon",
                lastName: "Holmes",
                email: "mh@me.com"
            });
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            status: 'created',
            data: {
                id: 1,
                firstName: "Malon",
                lastName: "Holmes",
                email: "mh@me.com"
            }
        })
    })

    it('should respond with 500 for failure', async () => {
        mockDatabase.createContact.mockRejectedValue(new Error('Database error'));

        const response = await request(testApp)
            .post('/contact')
            .send({
                firstName: "Malon",
                lastName: "Holmes",
                email: "mh@me.com"
            })
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(
            {
                status: 'error',
                message: 'database connection failed'
            }
        )

    })
});
