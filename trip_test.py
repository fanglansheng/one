import unittest
import json
import ast
from sqlalchemy.orm.session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from trip_planner import app
from trip_planner.models import *
from flask import url_for, Flask, jsonify
from sqlalchemy import distinct, and_

def print_response(res, msg=''):
    print msg
    print res.data, '\n'


class AppTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/trip_test.db"
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app = app.test_client()
        # db.init_app(self.app)
        db.drop_all()
        db.create_all()
        self.populate_db()

    def tearDown(self):
        # with self.app.app_context():
        db.drop_all()

    def populate_db(self):
        # create admin
        # admin = User('chuanz@genecloud.com', 'Chuan', 'Zhou')
        # db.session.add(admin)
        # test_user = User('test1@genecloud.com', 'Test1', 'User')
        # db.session.add(test_user)
        # db.session.commit()
        # assert len(User.query.all()) == 2
        
        # rv = self.app.get('/login/chuanz@genecloud.com')
        # create trip
        trip = Trip('Test Trip', 'some memo')
        db.session.add(trip)
        db.session.commit()
        assert len(Trip.query.all()) == 1

    def test_trip(self):
        print('# test_trip\n')
        assert len(Trip.query.all()) == 1

        #### post to create a new trip
        trip = dict(
            title='Las Vegas Road Trip', 
            memo='', 
            days=2
        )
        rv = self.app.post('/trip',
                    data=json.dumps(trip),
                    follow_redirects=True,
                    content_type='application/json')
        assert rv.status_code == 200
        assert len(Trip.query.all()) == 2
        # print_response(rv)


        #### get all trips
        req = self.app.get('/trip')
        assert req.status_code == 200
        print_response(req, 'trips: ')
        

        #### edit trip
        trip = dict( title='New title', memo='hahahah')
        req = self.app.post('/trip/2',
                    data=json.dumps(trip),
                    follow_redirects=True,
                    content_type='application/json')
        assert rv.status_code == 200
        print_response(req, 'edited trip: ')

        #### delete
        del_req = self.app.delete('/trip/2', follow_redirects=True)
        assert del_req.status_code == 200
        assert len(Trip.query.all()) == 1

        # rv1 = self.app.get('/fs/query/collection/3')
        # assert rv1.status_code == 200
        # res = json.loads(rv1.data)
        # assert len(res['content']) == 1

        # # check access 
        # self.app.get('/logout')
        # self.app.get('/login/test1@genecloud.com')
        # rv3 =self.app.get('/fs/collection/1', follow_redirects=True)
        # assert rv3.status_code == 400

    def test_itinerary(self):
        print '# test_itinerary\n'
        # post to create a new ititnerary
        req = self.app.post('/trip/1/itinerary',
                        data=json.dumps({'date':'20170904'}),
                        follow_redirects=True,
                        content_type='application/json')
        assert req.status_code == 200
        print_response(req)

        # edit the itineray
        req = self.app.post('itinerary/1',
                        data=json.dumps({'date':'20171010', 'memo':'abc'}),
                        follow_redirects=True,
                        content_type='application/json')
        assert req.status_code == 200
        print_response(req)

        # delete the itinerary
        req = self.app.delete('/itinerary/1', follow_redirects=True)
        assert req.status_code == 200
        
        # get trip's itineraies
        req = self.app.get('/trip/1/itinerary')
        assert req.status_code == 200
        print_response(req)



if __name__ == '__main__':
    unittest.main()